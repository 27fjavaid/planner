package com.planner.backend.repository;

import com.planner.backend.model.Task;
import com.planner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID>{
    List<Task> findByUserOrderByCreatedAtAsc(User user);
    List<Task> findByUserAndStatusOrderByCreatedAtAsc(User user, Task.Status status);
    Optional<Task> findByIdAndUser(UUID id, User user);
}
