import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/auth_model.dart';
import '../utils/storage_helper.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService;
  final StorageHelper _storage = StorageHelper();
  
  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._apiService) {
    _checkAuthStatus();
  }

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<void> _checkAuthStatus() async {
    final token = await _storage.getToken();
    if (token != null) {
      // Token exists, verify with backend
      try {
        final response = await _apiService.get('/api/auth/me');
        _user = User.fromJson(response);
        notifyListeners();
      } catch (e) {
        // Token invalid, clear it
        await _storage.clearToken();
      }
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.login(username, password);
      _user = User.fromJson(response.user);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}

