-- 'webcontainer' 사용자가 존재하지 않으면 생성
CREATE USER IF NOT EXISTS 'webcontainer'@'%' IDENTIFIED BY 'SJdnlvs642';

-- 'factorymanagement' 데이터베이스에 대한 모든 권한을 부여
GRANT ALL PRIVILEGES ON factorymanagement.* TO 'webcontainer'@'%';

-- 'KICT' 데이터베이스에 대한 모든 권한을 부여
GRANT ALL PRIVILEGES ON KICT.* TO 'webcontainer'@'%';

-- 변경 사항을 적용
FLUSH PRIVILEGES;
