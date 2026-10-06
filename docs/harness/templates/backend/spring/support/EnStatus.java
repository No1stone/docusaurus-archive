package com.example.template.support;

/** Soft status A/D — replace with project enum. */
public enum EnStatus {
    ACTIVE("A"),
    DEACTIVATED("D");

    private final String code;

    EnStatus(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static EnStatus of(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("status code required");
        }
        String c = code.trim();
        for (EnStatus s : values()) {
            if (s.code.equalsIgnoreCase(c) || s.name().equalsIgnoreCase(c)) {
                return s;
            }
        }
        throw new IllegalArgumentException("unknown status: " + code);
    }
}
