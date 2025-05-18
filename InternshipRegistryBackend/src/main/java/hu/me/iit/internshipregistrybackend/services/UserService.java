package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUserDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateUserPasswordDto;
import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateUserDto;
import hu.me.iit.internshipregistrybackend.entities.User;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.UserMapper;
import hu.me.iit.internshipregistrybackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User with username: '" + username + "' not found",
                        HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
    }

    public UserDto createUser(CreateUserDto userDto) {
        if(userRepository.existsByUsername(userDto.getUsername()))
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        User createUser = User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(userDto.getRole())
                .build();
        return userMapper.toDto(userRepository.save(createUser));
    }

    public UserDto updateUsername(String oldUsername, UpdateUserDto userDto) {
        User patchUser = userRepository.findByUsername(oldUsername).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        if(userRepository.existsByUsername(userDto.getUsername()))
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        patchUser.setUsername(userDto.getUsername());
        return userMapper.toDto(userRepository.save(patchUser));
    }

    public UserDto updatePassword(String username, UpdateUserPasswordDto passwordDto) {
        User patchUser = userRepository.findByUsername(username).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        patchUser.setPassword(passwordEncoder.encode(passwordDto.getPassword()));
        return userMapper.toDto(userRepository.save(patchUser));
    }

    public UserDto updateRole(String username, UpdateUserDto userDto) {
        User patchUser = userRepository.findByUsername(username).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        patchUser.setRole(userDto.getRole());
        return userMapper.toDto(userRepository.save(patchUser));
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        userRepository.deleteById(user.getId());
    }
}
