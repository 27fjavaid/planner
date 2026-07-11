package com.planner.backend.repository;

import com.planner.backend.model.Page;
import com.planner.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository 
public interface PageRepository extends JpaRepository<Page, UUID>{
    List<Page> findByUserAndParentPageIsNullOrderByCreatedAtAsc(User user);
    List<Page> findByUserAndParentPage(User user, Page parentPage);
    Optional<Page> findByIdAndUser(UUID id, User user);
    List<Page> findByUserAndTitleContainingIgnoreCase(User user, String title);

}
