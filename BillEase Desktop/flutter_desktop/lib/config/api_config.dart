/// API Configuration for Python Backend
class ApiConfig {
  // Python Backend API Base URL
  static const String baseUrl = 'http://127.0.0.1:8000';
  static const String apiPrefix = '/api';
  
  // API Endpoints
  static const String auth = '$apiPrefix/auth';
  static const String companies = '$apiPrefix/companies';
  static const String ledgers = '$apiPrefix/ledgers';
  static const String parties = '$apiPrefix/parties';
  static const String items = '$apiPrefix/items';
  static const String sales = '$apiPrefix/sales';
  static const String purchases = '$apiPrefix/purchases';
  static const String inventory = '$apiPrefix/inventory';
  static const String crm = '$apiPrefix/crm';
  static const String incomeExpense = '$apiPrefix/income-expense';
  static const String reports = '$apiPrefix/reports';
  static const String payroll = '$apiPrefix/payroll';
  static const String gst = '$apiPrefix/gst';
  static const String bankReconciliation = '$apiPrefix/bank-reconciliation';
  static const String importExport = '$apiPrefix/import-export';
  
  // Timeout settings
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Headers
  static Map<String, String> getHeaders({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
}

