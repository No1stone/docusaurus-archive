package com.example.template.support;

import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.UUID;

public final class UuidUtils {

    private UuidUtils() {
    }

    public static byte[] uuidToByte(UUID uuid) {
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(uuid.getMostSignificantBits());
        bb.putLong(uuid.getLeastSignificantBits());
        return bb.array();
    }

    public static String uuidToBase64(UUID uuid) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(uuidToByte(uuid));
    }

    public static UUID uuidFromBase64(String str) {
        byte[] bytes = Base64.getUrlDecoder().decode(str);
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        return new UUID(bb.getLong(), bb.getLong());
    }
}
