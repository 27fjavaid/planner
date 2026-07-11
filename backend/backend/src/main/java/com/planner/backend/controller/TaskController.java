package com.planner.backend.controller;

import com.planner.backend.model.Task;
import com.planner.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.planner.backend.model.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.planner.backend.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        String title = body.get("title");
        String description = body.get("description");
        Task.Priority priority = body.get("priority") != null
                ? Task.Priority.valueOf(body.get("priority"))
                : Task.Priority.MEDIUM;
        LocalDate dueDate = body.get("dueDate") != null
                ? LocalDate.parse(body.get("dueDate"))
                : null;
        return ResponseEntity.ok(taskService.createTask(user, title, description, priority, dueDate));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getAllTasks(user));
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable UUID taskId,
            @RequestBody Map<String, String> body) {
        Task.Status status = body.get("status") != null
                ? Task.Status.valueOf(body.get("status"))
                : null;
        Task.Priority priority = body.get("priority") != null
                ? Task.Priority.valueOf(body.get("priority"))
                : null;
        LocalDate dueDate = body.get("dueDate") != null
                ? LocalDate.parse(body.get("dueDate"))
                : null;
        return ResponseEntity.ok(taskService.updateTask(
                user, taskId, body.get("title"), body.get("description"), status, priority, dueDate));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @AuthenticationPrincipal User user,
            @PathVariable UUID taskId) {
        taskService.deleteTask(user, taskId);
        return ResponseEntity.noContent().build();
    }
}
