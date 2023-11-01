package com.laconic.pcms.utils;

import com.laconic.pcms.exceptions.NotFoundException;

import java.util.function.Supplier;

import static com.laconic.pcms.constants.AppMessages.*;

public abstract class ExceptionMapper {
    /**
     * Provides deleted message with entityName and id
     * @param placeholder
     * @param id
     * @return
     */
    public static String deletedMessage(String placeholder, Long id) {
        return String.format(DATA_DELETED, placeholder, id);
    }

    /**
     * Provide search attribute, entityName and search parameter
     * @param attribute
     * @param placeholder
     * @param parameter
     * @return
     */
    public static Supplier<NotFoundException> throwNotFoundException(String attribute, String placeholder, String parameter) {
        return () -> new NotFoundException(String.format(NOT_FOUND_FORMAT, placeholder, parameter, attribute));
    }

    public static Supplier<NotFoundException> throwNotFoundException(Long id, String placeholder) {
        return () -> new NotFoundException(String.format(NOT_FOUND_WITH_ID_FORMAT, placeholder, id));
    }

    /**
     * Provide entityName and parentName which is used to find the entity
     * @param id
     * @param parent
     * @param placeholder
     * @return
     */
    public static Supplier<NotFoundException> throwNotFoundException(Long id, String parent, String placeholder) {
        return () -> new NotFoundException(String.format(NOT_FOUND_WITH_PARENT_FORMAT, placeholder, parent, id));
    }

    /**
     * Provide entityId, entityName and parentName and parentId
     * @param id
     * @param parentId
     * @param parent
     * @param placeholder
     * @return
     */
    public static Supplier<NotFoundException> throwNotFoundException(Long id, Long parentId, String parent, String placeholder) {
        return () -> new NotFoundException(String.format(NOT_FOUND_WITH_ID_AND_PARENT_FORMAT, placeholder, parent, parentId, placeholder, id));
    }
}
