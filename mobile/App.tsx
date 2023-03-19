import './src/lib/dayjs';

// StyleSheet, Text, View são APIs que o React Native disponibiliza para utilizar na aplicação
// A View é utilizada para declarar o que seria uma div na web, a Text para declarar que quer renderizar texto
// Depois será renderizado utilizando a API nativa de acordo com o ambiente, seja no Android ou no iOS em que a aplicação estiver rodando
// StatusBar é uma API que consegue manipular a aparência dos elementos que compõe a StatusBar do dispositivo
import { StatusBar, Button } from 'react-native';
// useFonts para lidar com o carregamento das fontes
import {
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';
import * as Notifications from 'expo-notifications';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

// Setar as características da notificação, pois existem vários critérios que a notificação vai levar em consideração do próprio dispositivo para ter prioridade de exibição
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  }),
});

export default function App() {
  // fontsLoaded para garantir que a aplicação carregue as fontes antes do app ser exibido para o usuário
  // fontsLoaded é um valor booleano que vai dizer se a fonte está carregada ou não no dispositivo
  // como useFonts é um hook, se o valor de fontsLoaded mudar, vai notificar
  const [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold
  });

  async function scheduleNotification() {
    // Gatilho para determinar quando a notificação deve ser enviada
    const trigger = new Date(Date.now());
    trigger.setMinutes(trigger.getMinutes() + 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá, Madalena! 🤩',
        body: 'Você praticou seus hábitos hoje?'
      },
      trigger
    });
  }

  async function getScheduleNotification() {
    const schedules = await Notifications.getAllScheduledNotificationsAsync();
    console.log(schedules);
  }

  // Se a fonte não está disponível, não renderizar e exibir o conteúdo do app
  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

  // O React Native utiliza o React para desenvolver as interfaces de forma declarativa utilizando a sintaxe do JSX
  return (
    /*
    <>
      <Button title="Enviar Notificação" onPress={scheduleNotification} />
      <Button title="Notificações Agendadas" onPress={getScheduleNotification} />
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
    </>
    */
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
  // translucent para a tela começar do início da tela do dispositivo e a StatusBar ficar flutuando em cima da aplicação
}

// A estilização do React Native se dá através do flexbox e das propriedades já conhecidas do CSS para web
// API de StyleSheet para criar um objeto e dentro dele informar as regras de estilização que deseja aplicar
// No React Native, o flex já é ativo por padrão
