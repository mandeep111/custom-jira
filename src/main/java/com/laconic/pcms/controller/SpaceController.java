package com.laconic.pcms.controller;

import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.service.concrete.IFavoriteSpaceService;
import com.laconic.pcms.service.concrete.ISpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;
import static com.laconic.pcms.constants.AppConstants.*;
import static com.laconic.pcms.constants.AppMessages.SOMETHING_WENT_WRONG;

@RestController
@RequestMapping(Routes.space)
@RequiredArgsConstructor
public class SpaceController {

    private final ISpaceService spaceService;
    private final IFavoriteSpaceService favoriteSpaceService;

    @PostMapping
    public void save(@RequestBody @Valid SpaceRequest spaceRequest) {
        try {
            this.spaceService.save(spaceRequest);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid SpaceRequest spaceRequest, @PathVariable Long id) {
        try {
            this.spaceService.update(spaceRequest, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping("/name/{id}")
    public ResponseEntity<SpaceResponse> changeName(@PathVariable Long id, @RequestParam(value = "name") String name) {
        return ResponseEntity.ok().body(this.spaceService.updateName(name, id));
    }

    @PutMapping("/color/{id}")
    public ResponseEntity<SpaceResponse> changeColor(@PathVariable Long id, @RequestParam(value = "color") String color) {
        return ResponseEntity.ok().body(this.spaceService.updateColor(color, id));
    }

    @DeleteMapping("/{id}")
    public void disable(@PathVariable Long id) {
        try {
            this.spaceService.delete(id);
        } catch (Exception e) {
            throw new ServerException(SOMETHING_WENT_WRONG);
        }
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<SpaceResponse> getById(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        try {
            return ResponseEntity.ok(this.spaceService.getById(id, getEmailFromToken(jwt.getTokenValue())));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @PostMapping("/duplicate/{id}")
    public ResponseEntity<SpaceResponse> duplicate(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(this.spaceService.duplicate(id));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<SpaceResponse>> getAll(@AuthenticationPrincipal Jwt jwt, @RequestParam(value = "pageNo", defaultValue = DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                    @RequestParam(value = "pageSize", defaultValue = DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                    @RequestParam(value = "sortBy", defaultValue = DEFAULT_SORT_BY, required = false) String sortBy,
                                                                    @RequestParam(value = "sortDir", defaultValue = DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                    @RequestParam(value = "search", required = false) String keyword,
                                                                    @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {

        return ResponseEntity.ok(this.spaceService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes, getEmailFromToken(jwt.getTokenValue())));
    }

    @GetMapping(Routes.list)
    public ResponseEntity<List<SpaceResponse>> getAll(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(this.spaceService.getAll(getEmailFromToken(jwt.getTokenValue())));
    }

    @GetMapping("/url/{id}")
    public ResponseEntity<SpaceResponse> getByUrlAndId(@PathVariable Long id, @RequestParam String url) {
        return ResponseEntity.ok(this.spaceService.getByUrlAndId(id, url));
    }

    @GetMapping("/by-url")
    public ResponseEntity<SpaceResponse> getByUrl(@RequestParam String url) {
        return ResponseEntity.ok(this.spaceService.getByUrl(url));
    }

    @PostMapping("/favorite/{id}")
    public void makeFavorite(@PathVariable Long id) {
        this.favoriteSpaceService.addToFavorite(id);
    }

    @PostMapping("/assign/{id}")
    public void addAssignee(@PathVariable("id") Long id, @RequestParam(value = "userIds") List<Long> userIds) {
        try {
            this.spaceService.addAssignee(id, userIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/assign/{id}")
    public void removeAssignee(@PathVariable Long id, @RequestParam(value = "userIds") List<Long> userIds) {
        try {
            this.spaceService.removeAssignee(id, userIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/project/{id}")
    public void removeProject(@PathVariable Long id, @RequestParam(value = "projectIds") List<Long> projectIds) {
        try {
            this.spaceService.removeProjects(id, projectIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/favorite/{id}")
    public void removeFavorite(@PathVariable Long id) {
        this.favoriteSpaceService.removeFromFavorite(id);
    }
}
