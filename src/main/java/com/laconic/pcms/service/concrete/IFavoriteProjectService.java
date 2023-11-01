package com.laconic.pcms.service.concrete;

public interface IFavoriteProjectService {
    void addToFavorite(Long projectId);
    void removeFromFavorite(Long projectId);
}
