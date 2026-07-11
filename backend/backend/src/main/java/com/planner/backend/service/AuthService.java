package com.planner.backend.service;

import com.planner.backend.model.User;
import com.planner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.lang.RuntimeException;

import java.util.HashMap;
import java.util.Map;
@Service 
@RequiredArgsConstructor
public class AuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, String> register(String name, String email, String password){
        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setName(email);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
    public Map<String, String> login(String email, String password){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}