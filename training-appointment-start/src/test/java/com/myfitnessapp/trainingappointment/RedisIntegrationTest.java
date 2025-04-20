package com.myfitnessapp.trainingappointment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class RedisIntegrationTest {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testSetAndGetValue() {
        // 定义一个测试用的 key 和 value
        String key = "verification_code:test@example.com";
        String expectedValue = "123456";

        // 将值存入 Redis，通常验证码服务里会设置一个过期时间
        stringRedisTemplate.opsForValue().set(key, expectedValue);

        // 从 Redis 中取出值
        String actualValue = stringRedisTemplate.opsForValue().get(key);

        // 验证是否成功存取
        assertEquals(expectedValue, actualValue);
    }
}
