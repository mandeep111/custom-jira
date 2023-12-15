package com.laconic.pcms.utils;

import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.GsonBuilder;

public class JsonFormatter {
    public static String pretty(String json) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            Object jsonObject = gson.fromJson(json, Object.class);
            return gson.toJson(jsonObject);
        } catch (Exception e) {
            return json;
        }
    }
}
