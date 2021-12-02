using System;
using System.Collections.Generic;

namespace Peg
{
    internal class Unsubscriber<Keymap> : IDisposable
    {
        private List<IObserver<Keymap>> _observers;
        private IObserver<Keymap> _observer;

        internal Unsubscriber(List<IObserver<Keymap>> observers, IObserver<Keymap> observer)
        {
            this._observers = observers;
            this._observer = observer;
        }

        public void Dispose()
        {
            if (_observers.Contains(_observer))
                _observers.Remove(_observer);
        }
    }
}