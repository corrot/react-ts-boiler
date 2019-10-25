import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import App from '@/router/app';
import { configureStore, history } from '@/store';
import { themeSwitch } from '@/store/ducks/app/action-creators';
import storage from '@/utils/storage';

export const store = configureStore();

history.listen(() => window.scrollTo(0, 0));

const storageTheme = storage('theme').get();
if (storageTheme && storageTheme !== 'light') store.dispatch<any>(themeSwitch(storageTheme));

const renderApp = (Application: any) =>
	render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Application />
			</ConnectedRouter>
		</Provider>,
		document.getElementById('app')
	);

renderApp(App);

if (process.env.NODE_ENV === 'production') {
	import('offline-plugin/runtime').then(plugin => {
		plugin.install({
			onUpdateReady: () => plugin.applyUpdate(),
			onUpdated: () => window.location.reload()
		});
	});
}

if (process.env.NODE_ENV === 'development') {
	// causes unexpected hook errors?
	// const { whyDidYouUpdate } = require('why-did-you-update');
	// whyDidYouUpdate(React);

	if (module.hot) {
		module.hot.accept('./router/app', () => {
			renderApp(require('./router/app').default);
		});
		module.hot.accept('./store/ducks/root-reducer', () => {
			store.replaceReducer(require('./store/ducks/root-reducer').default(history));
		});
	}
}
