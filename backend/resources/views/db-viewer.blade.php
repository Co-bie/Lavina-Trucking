<!DOCTYPE html>
<html>
<head>
    <title>Database Viewer - Lavina Trucking</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #1e786c; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f0f8ff; }
        .table-section { margin: 30px 0; }
        h1 { color: #1e786c; text-align: center; margin-bottom: 30px; }
        h2 { color: #1e786c; border-bottom: 2px solid #cfab3d; padding-bottom: 10px; }
        .count { color: #cfab3d; font-weight: bold; }
        .info-box { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1e786c; }
        .nav { text-align: center; margin: 20px 0; }
        .btn { background: #1e786c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 10px; }
        .btn:hover { background: #cfab3d; }
        .field-details { font-size: 0.9em; color: #666; }
        .password-field { background: #ffe6e6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚛 Lavina Trucking Database Viewer</h1>
        
        <div class="nav">
            <a href="/" class="btn">← Back to App</a>
            <a href="/phpMyAdmin-5.2.2-all-languages/" class="btn">phpMyAdmin</a>
            <a href="javascript:location.reload()" class="btn">🔄 Refresh</a>
        </div>

        <div class="info-box">
            <strong>Database Info:</strong><br>
            📍 <strong>Location:</strong> {{ database_path('database.sqlite') }}<br>
            📊 <strong>Type:</strong> SQLite Database<br>
            ⏰ <strong>Last Updated:</strong> {{ now()->format('Y-m-d H:i:s') }}
        </div>
        
        <div class="table-section">
            <h2>👥 Users Table <span class="count">({{ $users->count() }} records)</span></h2>
            @if($users->count() > 0)
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>User Type</th>
                            <th>Employment Status</th>
                            <th>Active</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $user)
                            <tr>
                                <td><strong>{{ $user->id }}</strong></td>
                                <td>{{ $user->name ?? 'N/A' }}</td>
                                <td>{{ $user->first_name ?? 'N/A' }}</td>
                                <td>{{ $user->last_name ?? 'N/A' }}</td>
                                <td>{{ $user->email }}</td>
                                <td><span style="background: #e3f2fd; padding: 3px 8px; border-radius: 3px;">{{ $user->user_type ?? 'N/A' }}</span></td>
                                <td><span style="background: #e8f5e8; padding: 3px 8px; border-radius: 3px;">{{ $user->employment_status ?? 'N/A' }}</span></td>
                                <td>{{ $user->is_active ? '✅ Yes' : '❌ No' }}</td>
                                <td>{{ $user->created_at ? $user->created_at->format('Y-m-d H:i') : 'N/A' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <div class="info-box">
                    <strong>🔐 Test Login Credentials:</strong><br>
                    📧 <strong>Email:</strong> test@example.com<br>
                    🔑 <strong>Password:</strong> password123
                </div>
            @else
                <div class="info-box" style="border-left-color: #ff6b6b; background: #fff5f5;">
                    <strong>⚠️ No users found in database.</strong><br>
                    The users table is empty. You may need to create a test user.
                </div>
            @endif
        </div>

        <div class="table-section">
            <h2>📋 Database Tables Overview</h2>
            <table style="width: auto;">
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Description</th>
                        <th>Records</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>users</strong></td>
                        <td>User accounts and profiles</td>
                        <td><span class="count">{{ $users->count() }}</span></td>
                    </tr>
                    <tr>
                        <td><strong>cache</strong></td>
                        <td>Application cache data</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td><strong>jobs</strong></td>
                        <td>Background job queue</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td><strong>password_reset_tokens</strong></td>
                        <td>Password reset tokens</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td><strong>sessions</strong></td>
                        <td>User session data</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>

        @if($users->count() > 0)
        <div class="table-section">
            <h2>🔍 User Details</h2>
            @foreach($users as $user)
                <div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;">
                    <h3>User #{{ $user->id }} - {{ $user->name }}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        <div><strong>Email:</strong> {{ $user->email }}</div>
                        <div><strong>User Type:</strong> {{ $user->user_type ?? 'N/A' }}</div>
                        <div><strong>Employment:</strong> {{ $user->employment_status ?? 'N/A' }}</div>
                        <div><strong>Active:</strong> {{ $user->is_active ? 'Yes' : 'No' }}</div>
                        @if($user->phone)
                        <div><strong>Phone:</strong> {{ $user->phone }}</div>
                        @endif
                        @if($user->address)
                        <div><strong>Address:</strong> {{ $user->address }}</div>
                        @endif
                        <div><strong>Created:</strong> {{ $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : 'N/A' }}</div>
                        <div><strong>Updated:</strong> {{ $user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : 'N/A' }}</div>
                    </div>
                </div>
            @endforeach
        </div>
        @endif
    </div>
</body>
</html>
