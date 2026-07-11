package com.planner.backend.service;

import com.planner.backend.model.Task;
import com.planner.backend.model.User;
import com.planner.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(User user, String title, String description, Task.Priority priority, LocalDate dueDate) {
        Task task = new Task();
        task.setUser(user);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(priority != null ? priority : Task.Priority.MEDIUM);
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.TODO);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(User user) {
        return taskRepository.findByUserOrderByCreatedAtAsc(user);
    }

    public Task updateTask(User user, UUID taskId, String title, String description,
                           Task.Status status, Task.Priority priority, LocalDate dueDate) {
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (title != null) task.setTitle(title);
        if (description != null) task.setDescription(description);
        if (status != null) task.setStatus(status);
        if (priority != null) task.setPriority(priority);
        if (dueDate != null) task.setDueDate(dueDate);
        return taskRepository.save(task);
    }

    public void deleteTask(User user, UUID taskId) {
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }
}

