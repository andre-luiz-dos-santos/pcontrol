import { Observable, Subscriber, Subscription } from 'rxjs'

interface Item<T> {
	seq: number
	value: T
	subscription?: Subscription
}

class Buffer<T> {
	data: Item<T>[] = []
	nextSeq = 0

	getValues(): T[] {
		return Object.values(this.data)
			.map((item: Item<T>) => item.value)
	}

	add(value: T): Item<T> {
		const seq = ++this.nextSeq
		const item = { seq, value }
		this.data[seq] = item
		return item
	}

	remove(seq: number): void {
		for (; ; seq--) {
			let item = this.data[seq]
			if (item == null) {
				return
			}
			delete this.data[seq]
			if (item.subscription != null) {
				item.subscription.unsubscribe()
			}
		}
	}

	removeAll(): void {
		this.remove(this.nextSeq)
	}
}

function bufferSeq<T>(callback: (value: T[]) => Observable<any>) {
	return Observable.create((subscriber: Subscriber<T>) => {
		const source: Observable<T> = this
		const buffer = new Buffer<T>()

		function onSourceValue(value: T) {
			const item = buffer.add(value)
			const observable = callback(buffer.getValues())
			item.subscription = observable.subscribe(
				() => { },
				err => { /* item will be retried on the next source value */ },
				() => buffer.remove(item.seq),
			)
		}

		const sourceSubscription = source.subscribe(
			onSourceValue,
			err => subscriber.error(err),
			() => subscriber.complete()
		)

		return () => {
			sourceSubscription.unsubscribe()
			buffer.removeAll()
		}
	})
}

declare module "rxjs/Observable" {
	interface Observable<T> {
		bufferSeq: (callback: (value: T[]) => Observable<any>) => any
	}
}

Observable.prototype.bufferSeq = bufferSeq
