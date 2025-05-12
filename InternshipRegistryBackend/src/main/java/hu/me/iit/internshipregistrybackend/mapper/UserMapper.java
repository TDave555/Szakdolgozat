package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    User toEntity(UserDto userDto);

    UserDto toDto(User user);

    List<UserDto> toDtoList(List<User> users);

}
