/*!
 * Copyright 2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { OnDestroy } from '@angular/core';

import { Subscription, Observable, PartialObserver } from 'rxjs';
import { SubscriptionTracker, ISubscriptionTracker } from './subscription-tracker';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Creates a constructor for a class that can automatically subscribe and unsubscribe from observables.
 *
 * All subscriptions are automatically removed when the component is destroyed
 */
// tslint:disable-next-line: typedef
export function SubscriptionTrackerMixin<TBase extends Constructor>(Base: TBase) {
    return class extends Base implements ISubscriptionTracker, OnDestroy {
        constructor(...params: any[]) {
            super(params);
            this.tracker = new SubscriptionTracker(this);
        }

        tracker: SubscriptionTracker;

        public subscribe<T>(
            observable: Observable<T>,
            observerOrNext?: PartialObserver<T> | ((value: T) => void),
            error?: (error: any) => void,
            complete?: () => void
        ): Subscription {
            return this.tracker.subscribe(observable, observerOrNext, error, complete);
        }

        public unsubscribe(subscription: Subscription): Subscription {
            return this.tracker.unsubscribe(subscription);
        }

        unsubscribeAll(): void {
            this.tracker.unsubscribeAll();
        }

        ngOnDestroy(): void {
            this.unsubscribeAll();
        }
    };
}