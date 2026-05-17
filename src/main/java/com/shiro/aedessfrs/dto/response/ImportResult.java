package com.shiro.aedessfrs.dto.response;

import java.util.List;

public record ImportResult(

        long totalRows,
        long inserted,
        long skipped,
        List<ImportErrors> errors

) {
}
