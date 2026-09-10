-- 用户表新增「部门」和「职位」字段，并随机分配给现有用户
-- 部门：人事部门 / 管理部门 / 财务部门
-- 职位：经理 / 副经理 / 员工

ALTER TABLE `sys_user`
    ADD COLUMN `department` varchar(50) DEFAULT NULL COMMENT '部门' AFTER `status`,
    ADD COLUMN `position`   varchar(50) DEFAULT NULL COMMENT '职位' AFTER `department`;

-- 随机分配部门给现有用户（未填写的用户）
UPDATE `sys_user`
SET `department` = ELT(1 + FLOOR(RAND() * 3), '人事部门', '管理部门', '财务部门')
WHERE `department` IS NULL OR `department` = '';

-- 随机分配职位给现有用户（未填写的用户）
UPDATE `sys_user`
SET `position` = ELT(1 + FLOOR(RAND() * 3), '经理', '副经理', '员工')
WHERE `position` IS NULL OR `position` = '';
