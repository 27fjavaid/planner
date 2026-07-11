package com.planner.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "pages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Page {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_page_id")
    private Page parentPage;

    @Column(nullable = false)
    private String title = "Untitled";

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate 
    public void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}