package com.laconic.pcms.service.concrete;

public interface IFavoriteSpaceService {
    void addToFavorite(Long spaceId);
    void removeFromFavorite(Long spaceId);
}
