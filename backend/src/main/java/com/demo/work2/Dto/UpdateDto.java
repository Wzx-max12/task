package com.demo.work2.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateDto {
    @NotBlank(message = "密码不能为空")
    @Size(min =6,max = 16, message ="密码长度6-16位")
    private  String password;
    private String nickname;
    private String email;
    private String phone;
    private Integer id;
    private Integer status;



}
