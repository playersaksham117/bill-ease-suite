import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BillEase Suite'),
        actions: [
          Consumer<AuthProvider>(
            builder: (context, authProvider, _) {
              return PopupMenuButton<String>(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        child: Text(
                          authProvider.user?.username[0].toUpperCase() ?? 'U',
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(authProvider.user?.username ?? 'User'),
                    ],
                  ),
                ),
                itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                  const PopupMenuItem(
                    value: 'profile',
                    child: Row(
                      children: [
                        Icon(Icons.person),
                        SizedBox(width: 8),
                        Text('Profile'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'settings',
                    child: Row(
                      children: [
                        Icon(Icons.settings),
                        SizedBox(width: 8),
                        Text('Settings'),
                      ],
                    ),
                  ),
                  const PopupMenuDivider(),
                  PopupMenuItem(
                    value: 'logout',
                    child: const Row(
                      children: [
                        Icon(Icons.logout, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Logout', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                    onTap: () async {
                      await authProvider.logout();
                      if (context.mounted) {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (_) => const LoginScreen(),
                          ),
                        );
                      }
                    },
                  ),
                ],
              );
            },
          ),
        ],
      ),
      body: GridView.count(
        crossAxisCount: 3,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildModuleCard(
            context,
            'POS',
            Icons.point_of_sale,
            Colors.blue,
            onTap: () {
              // Navigate to POS screen
            },
          ),
          _buildModuleCard(
            context,
            'CRM',
            Icons.people,
            Colors.green,
            onTap: () {
              // Navigate to CRM screen
            },
          ),
          _buildModuleCard(
            context,
            'Inventory',
            Icons.inventory,
            Colors.orange,
            onTap: () {
              // Navigate to Inventory screen
            },
          ),
          _buildModuleCard(
            context,
            'Sales',
            Icons.shopping_cart,
            Colors.purple,
            onTap: () {
              // Navigate to Sales screen
            },
          ),
          _buildModuleCard(
            context,
            'Purchases',
            Icons.shopping_bag,
            Colors.teal,
            onTap: () {
              // Navigate to Purchases screen
            },
          ),
          _buildModuleCard(
            context,
            'Accounts',
            Icons.account_balance,
            Colors.indigo,
            onTap: () {
              // Navigate to Accounts screen
            },
          ),
          _buildModuleCard(
            context,
            'Income/Expense',
            Icons.attach_money,
            Colors.amber,
            onTap: () {
              // Navigate to Income/Expense screen
            },
          ),
          _buildModuleCard(
            context,
            'Reports',
            Icons.assessment,
            Colors.red,
            onTap: () {
              // Navigate to Reports screen
            },
          ),
          _buildModuleCard(
            context,
            'GST',
            Icons.receipt,
            Colors.brown,
            onTap: () {
              // Navigate to GST screen
            },
          ),
        ],
      ),
    );
  }

  Widget _buildModuleCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color, {
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: color),
              const SizedBox(height: 16),
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

