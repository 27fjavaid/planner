package com.planner.backend.service;

import com.planner.backend.model.Page;
import com.planner.backend.model.User;
import com.planner.backend.repository.PageRepository;
import com.planner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PageService{
    private final PageRepository pageRepository;
    private final UserRepository userRepository;

    public Page createPage(User user, UUID parentPageId){
        Page page = new Page();
        page.setUser(user);
        page.setTitle("Untitled");
        if(parentPageId != null){
            Page parentPage = pageRepository.findByIdAndUser(parentPageId, user)
                    .orElseThrow(() -> new RuntimeException("Parent page not found"));
            page.setParentPage(parentPage);

        }
        return pageRepository.save(page);
    }
    public List<Page> getRootPages(User user) {
    return pageRepository.findByUserAndParentPageIsNullOrderByCreatedAtAsc(user);
}
    public List<Page> getSubPages(User user, UUID parentPageId){
        Page parentPage = pageRepository.findByIdAndUser(parentPageId, user)
                .orElseThrow(() -> new RuntimeException("Page not found"));
        return pageRepository.findByUserAndParentPage(user, parentPage);
    }
    public Page getPage(User user, UUID pageId){
        return pageRepository.findByIdAndUser(pageId, user)
                .orElseThrow(() -> new RuntimeException("Page not found"));
    }
    public Page updatePage(User user, UUID pageId, String title, String content){
        Page page = getPage(user, pageId);
        if(title != null) page.setTitle(title);
        if(content != null) page.setContent(content);
        return pageRepository.save(page);
    }
    public void deletePage(User user, UUID pageId){
        Page page = getPage(user, pageId);
        pageRepository.delete(page);
    }
    public List<Page> searchPages(User user, String query){
        return pageRepository.findByUserAndTitleContainingIgnoreCase(user, query);
    }
}
