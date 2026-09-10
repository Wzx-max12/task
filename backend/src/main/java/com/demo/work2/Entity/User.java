package com.demo.work2.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//建造实体类User
@NoArgsConstructor
@Data
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private String nickname;
    private String phone;
    private String email;
    private Integer status;
    private String department;
    private String position;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}