import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { RootState, store } from './redux/store';
import { useEffect, useRef } from 'react';
import { ProfilePage } from './profile/ProfilePage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { commonAction } from './redux/common';
import CssBaseline from '@mui/material/CssBaseline';
import { appColor } from './common/color';
import _ from 'lodash';
import Message from './components/Message';
import { profileAction } from './redux/profile';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: appColor.primary.dark,
    },
    text: {
      primary: appColor.primary.primaryText,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        style: {
          textTransform: 'none',
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        style: {
          background: appColor.secondary.dark,
        },
      },
    },
    MuiTableContainer: {
      defaultProps: {
        style: {
          background: appColor.primary.dark,
        },
      },
    },
  },
});

function AppContainer() {
  const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.state.message);
  return (
    <>
      <ProfilePage />
      <Message
        message={message.msg}
        type={message.type}
        onHide={() =>
          dispatch(
            commonAction.updateState({
              message: { type: 'success', msg: null },
            }),
          )
        }
      />
    </>
  );
}

export default function App() {
  const showMessage = useRef(
    _.throttle((data: any) => {
      store.dispatch(commonAction.updateState({ message: data }));
    }, 1000),
  );

  useEffect(() => {
    
    window.MyShortcutApi.onMessage((event: any, data: any) => {
      showMessage.current(data);
    });

    window.MyShortcutApi.onProfilesChanged((event: any, data: any) => {
      console.log('profiles changed', data);
      store.dispatch(
        profileAction.updateState({
          data: data.profiles,
        }),
      );
    });

    window.MyShortcutApi.syncProfiles();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <AppContainer />
      </Provider>
    </ThemeProvider>
  );
}
