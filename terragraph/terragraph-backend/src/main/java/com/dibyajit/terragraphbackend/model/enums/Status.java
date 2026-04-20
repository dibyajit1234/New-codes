package com.dibyajit.terragraphbackend.model.enums;

public enum Status {
    DRAFT,GENERATING,COMPLETED;

    public static Status getDefault(){
        return DRAFT;
    }
}
