<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        try {
            $posts = \App\Models\Post::with('author')->get();
            if ($posts->isEmpty()) {
                return response()->json(['message' => 'Nenhum post encontrado'], 404);
            }
            return response()->json($posts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar posts: ' . $e->getMessage()], 400);
        }
    }

    public function myPosts()
    {
        try {
            $posts = \App\Models\Post::where('author_id', Auth::id())->get();
            if ($posts->isEmpty()) {
                return response()->json(['error' => 'Nehum post'], 400);
            }
            return response()->json($posts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar meus posts: ' . $e->getMessage()], 400);
        }
        return response()->json(Post::where('user_id', Auth::id())->get());
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'messages' => $validator->errors()
                ], 422);
            }

            $post = \App\Models\Post::create([
                'title' => $request->title,
                'content' => $request->content,
                'author_id' => $request->user()->id,
            ]);
            if (!$post) {
                DB::rollBack();
                return response()->json(['error' => 'Falha ao criar post'], 500);
            }
            $post->load('author');
            DB::commit();
            return response()->json($post, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao criar post: ' . $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $post = \App\Models\Post::with('author')->find($id);
            if (!$post) {
                return response()->json(['message' => 'Post não encontrado'], 404);
            }
            return response()->json($post);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar post: ' . $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $post = \App\Models\Post::findorFail($id);
            if (!$post) {
                return response()->json(['message' => 'Post não encontrado'], 404);
            }
            $post->update($request->only(['title', 'content']));
            DB::commit();
            return response()->json($post);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao atualizar post: ' . $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $post = \App\Models\Post::findorFail($id);
            if (!$post) {
                return response()->json(['message' => 'Post não encontrado'], 404);
            }
            $post->delete();
            DB::commit();
            return response()->json(['message' => 'Post deletado com sucesso']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao deletar post: ' . $e->getMessage()], 400);
        }
    }

    public function getReportData()
    {
        try {
            $driver = DB::connection()->getDriverName();
            $rawSql = ($driver === 'sqlite')
                ? "strftime('%Y-%m', created_at) as month, count(*) as count"
                : "DATE_FORMAT(created_at, '%Y-%m') as month, count(*) as count";
            $posts = \App\Models\Post::where('created_at', '>=', now()->subYear())
            ->orderBy('created_at', 'asc')
            ->get();

            $chartData = Post::selectRaw($rawSql)
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('month')
            ->get();

            return response()->json([
                'list' => $posts,
                'chart' => $chartData
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao gerar relatório: ' . $e->getMessage()], 400);
        }
    }
}
