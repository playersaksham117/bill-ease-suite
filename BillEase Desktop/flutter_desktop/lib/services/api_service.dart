import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/auth_model.dart';
import '../utils/storage_helper.dart';

/// API Service for communicating with Python Backend
class ApiService {
  late Dio _dio;
  final StorageHelper _storage = StorageHelper();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.connectTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
      headers: ApiConfig.getHeaders(),
    ));

    // Add interceptors for logging and error handling
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    // Add token interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Handle unauthorized - clear token and redirect to login
          _storage.clearToken();
        }
        return handler.next(error);
      },
    ));
  }

  // Authentication
  Future<AuthResponse> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '${ApiConfig.auth}/login',
        data: {
          'username': username,
          'password': password,
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      await _storage.saveToken(authResponse.accessToken);
      return authResponse;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('${ApiConfig.auth}/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      await _storage.clearToken();
    }
  }

  // Generic GET request
  Future<dynamic> get(String endpoint, {Map<String, dynamic>? queryParameters}) async {
    try {
      final response = await _dio.get(endpoint, queryParameters: queryParameters);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Generic POST request
  Future<dynamic> post(String endpoint, {dynamic data}) async {
    try {
      final response = await _dio.post(endpoint, data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Generic PUT request
  Future<dynamic> put(String endpoint, {dynamic data}) async {
    try {
      final response = await _dio.put(endpoint, data: data);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Generic DELETE request
  Future<dynamic> delete(String endpoint) async {
    try {
      final response = await _dio.delete(endpoint);
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Health check
  Future<bool> checkHealth() async {
    try {
      final response = await _dio.get('/api/health');
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response != null) {
        final data = error.response?.data;
        if (data is Map && data.containsKey('detail')) {
          return data['detail'].toString();
        }
        return 'Error: ${error.response?.statusCode} - ${error.response?.statusMessage}';
      } else if (error.type == DioExceptionType.connectionTimeout ||
          error.type == DioExceptionType.receiveTimeout) {
        return 'Connection timeout. Please check if Python backend is running.';
      } else if (error.type == DioExceptionType.connectionError) {
        return 'Cannot connect to server. Please ensure Python backend is running on ${ApiConfig.baseUrl}';
      }
    }
    return error.toString();
  }
}

