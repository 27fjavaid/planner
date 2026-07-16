package com.planner.backend.controller;

import com.planner.backend.model.Page;
import com.planner.backend.model.User;
import com.planner.backend.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PageController {

    private final PageService pageService;

    @PostMapping
    public ResponseEntity<Page> createPage(
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) Map<String, String> body) {
        UUID parentPageId = null;
        if (body != null && body.get("parentPageId") != null) {
            parentPageId = UUID.fromString(body.get("parentPageId"));
        }
        return ResponseEntity.ok(pageService.createPage(user, parentPageId));
    }

    @GetMapping
    public ResponseEntity<List<Page>> getRootPages(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(pageService.getRootPages(user));
    }

    @GetMapping("/{pageId}/subpages")
    public ResponseEntity<List<Page>> getSubPages(
            @AuthenticationPrincipal User user,
            @PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.getSubPages(user, pageId));
    }

    @GetMapping("/{pageId}")
    public ResponseEntity<Page> getPage(
            @AuthenticationPrincipal User user,
            @PathVariable UUID pageId) {
        return ResponseEntity.ok(pageService.getPage(user, pageId));
    }

    @PatchMapping("/{pageId}")
    public ResponseEntity<Page> updatePage(
            @AuthenticationPrincipal User user,
            @PathVariable UUID pageId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(pageService.updatePage(
                user, pageId, body.get("title"), body.get("content")));
    }

    @DeleteMapping("/{pageId}")
    public ResponseEntity<Void> deletePage(
            @AuthenticationPrincipal User user,
            @PathVariable UUID pageId) {
        pageService.deletePage(user, pageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Page>> searchPages(
            @AuthenticationPrincipal User user,
            @RequestParam String query) {
        return ResponseEntity.ok(pageService.searchPages(user, query));
    }
}