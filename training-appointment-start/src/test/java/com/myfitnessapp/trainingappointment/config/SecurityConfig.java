package com.myfitnessapp.trainingappointment.config;
import com.myfitnessapp.service.user.service.impl.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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
                .antMatchers("/api/appointments/**").permitAll()
                .antMatchers("/api/memberships/**").permitAll()
                .anyRequest().authenticated()
                .and()
                // 根据需要禁用 CSRF（如果前后端分离，通常需要禁用）
                .csrf().disable();
    }
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth,
                                CustomUserDetailsService userDetailsService) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
