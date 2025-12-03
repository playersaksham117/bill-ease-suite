import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/api_service.dart';
import 'services/database_service.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize local database
  await DatabaseService.initialize();
  
  runApp(const BillEaseApp());
}

class BillEaseApp extends StatelessWidget {
  const BillEaseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(ApiService())),
      ],
      child: MaterialApp(
        title: 'BillEase Suite',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF2563EB),
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          cardTheme: CardThemeData(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            filled: true,
          ),
        ),
        home: const SplashScreen(),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/dashboard': (context) => const DashboardScreen(),
        },
      ),
    );
  }
}
