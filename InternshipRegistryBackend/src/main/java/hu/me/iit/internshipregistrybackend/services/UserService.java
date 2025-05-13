package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create.CreateUserDto;
import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.dtos.update.UpdateUserDto;
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

    public UserDto getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
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

    public UserDto updateUser(Long id, UpdateUserDto userDto) {
        User updateUser = userRepository.findById(id)
                        .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        if(!updateUser.getUsername().equals(userDto.getUsername())) {
            if(userRepository.existsByUsername(userDto.getUsername()))
                throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
            updateUser.setUsername(userDto.getUsername());
        }
            updateUser.setRole(userDto.getRole());

        return userMapper.toDto(userRepository.save(updateUser));
    }

    public UserDto updateUsername(String oldUsername, String newUsername) {
        User updateUser = userRepository.findByUsername(oldUsername).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        if(userRepository.existsByUsername(newUsername))
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        updateUser.setUsername(newUsername);
        return userMapper.toDto(userRepository.save(updateUser));
    }

    public UserDto updatePassword(String username, String newPassword) {
        User updateUser = userRepository.findByUsername(username).orElseThrow(() ->
                new AppException("User not found", HttpStatus.NOT_FOUND));
        updateUser.setPassword(passwordEncoder.encode(newPassword));
        return userMapper.toDto(userRepository.save(updateUser));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
