package com.demo.work2.Dto;

import lombok.Data;

@Data
public class UpdateDto {
    // 密码可选：编辑时留空表示不修改密码
    private String password;
    private String nickname;
    private String email;
    private String phone;
    private Integer id;
    private Integer status;
    private String department;
    private String position;



}
