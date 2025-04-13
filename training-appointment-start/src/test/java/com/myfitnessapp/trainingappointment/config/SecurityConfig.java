package com.myfitnessapp.trainingappointment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                // 允许所有用户访问 /api/users/** 下的接口
                .antMatchers("/api/users/**").permitAll()
                .anyRequest().authenticated()
                .and()
                // 根据需要禁用 CSRF（如果前后端分离，通常需要禁用）
                .csrf().disable();
    }
}
