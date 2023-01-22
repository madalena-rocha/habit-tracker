import { createNativeStackNavigator} from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();
// Navigator para criar o escopo da rota e Screen para definir aonde cada vai levar, qual componente será renderizado para cada rota

import { Home } from '../screens/Home';
import { New } from '../screens/New';
import { Habit } from '../screens/Habit';

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen 
                name="home"
                component={Home}
                // Quando alguém acessar a rota home, renderizar a tela Home
            />

            <Screen 
                name="new"
                component={New}
            />

            <Screen 
                name="habit"
                component={Habit}
            />
        </Navigator>
    );
}
