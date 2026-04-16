use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::get('/dashboard', [TaskController::class, 'dashboard'])->name('dashboard');
Route::get('/my-tasks', [TaskController::class, 'myTasks'])->name('tasks.mine');
Route::get('/notifications', [TaskController::class, 'notifications'])->name('notifications');
Route::get('/settings', [TaskController::class, 'settings'])->name('settings');
