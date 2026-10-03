import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { gaussian, rng, toPath } from './random';

interface Level {
  price: number;
  size: number;
}

interface Print {
  id: number;
  time: string;
  side: 'B' | 'S';
  price: number;
  size: number;
}

const DEPTH = 9;
const TICK = 0.01;
const HISTORY = 140;

/** A simulated limit order book: depth ladder, mid-price trace and the tape. Not market data. */
@Component({
  selector: 'aw-order-book',
  templateUrl: './order-book.html',
  styleUrl: './order-book.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderBook {
  private readonly rand = rng(9001);
  private readonly z = gaussian(this.rand);
  private midTicks = 10_000; // 100.00
  private printId = 0;

  protected readonly bids = signal<Level[]>([]);
  protected readonly asks = signal<Level[]>([]);
  protected readonly tape = signal<Print[]>([]);
  protected readonly history = signal<number[]>([]);
  protected readonly lastSide = signal<'up' | 'down' | null>(null);

  protected readonly maxSize = computed(() => Math.max(1, ...this.bids().map((l) => l.size), ...this.asks().map((l) => l.size)));
  protected readonly mid = computed(() => this.midTicks * TICK);
  protected readonly spread = computed(() => {
    const a = this.asks()[0]?.price ?? 0;
    const b = this.bids()[0]?.price ?? 0;
    return a - b;
  });
  protected readonly imbalance = computed(() => {
    const b = this.bids().slice(0, 3).reduce((s, l) => s + l.size, 0);
    const a = this.asks().slice(0, 3).reduce((s, l) => s + l.size, 0);
    return (b - a) / (b + a || 1);
  });
  protected readonly trace = computed(() => {
    const h = this.history();
    if (h.length < 2) return '';
    const min = Math.min(...h) - 2;
    const max = Math.max(...h) + 2;
    return toPath(h.map((v, i) => [(i / (HISTORY - 1)) * 400, 80 - ((v - min) / (max - min)) * 80] as const));
  });

  constructor() {
    for (let i = 0; i < HISTORY; i++) this.step(false);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = setInterval(() => this.step(true), 420);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  private step(withTape: boolean): void {
    const prev = this.midTicks;
    const move = this.z();
    if (Math.abs(move) > 0.9) this.midTicks += Math.sign(move);
    this.lastSide.set(this.midTicks > prev ? 'up' : this.midTicks < prev ? 'down' : this.lastSide());

    const spreadTicks = this.rand() < 0.8 ? 1 : 2;
    const bestBid = this.midTicks;
    const bestAsk = this.midTicks + spreadTicks;
    const level = (ticks: number, i: number): Level => ({
      price: ticks * TICK,
      size: Math.round((180 + i * 70) * (0.45 + this.rand() * 1.1)),
    });
    this.bids.set(Array.from({ length: DEPTH }, (_, i) => level(bestBid - i, i)));
    this.asks.set(Array.from({ length: DEPTH }, (_, i) => level(bestAsk + i, i)));
    this.history.update((h) => [...h.slice(-(HISTORY - 1)), this.midTicks]);

    if (withTape && this.rand() < 0.7) {
      const side = this.rand() < 0.5 + this.imbalance() * 0.3 ? 'B' : 'S';
      const now = new Date();
      const print: Print = {
        id: ++this.printId,
        time: `${now.toISOString().slice(11, 19)}.${String(now.getMilliseconds()).padStart(3, '0')}`,
        side,
        price: side === 'B' ? bestAsk * TICK : bestBid * TICK,
        size: Math.round(10 + this.rand() * 490),
      };
      this.tape.update((t) => [print, ...t].slice(0, 9));
    }
  }
}
