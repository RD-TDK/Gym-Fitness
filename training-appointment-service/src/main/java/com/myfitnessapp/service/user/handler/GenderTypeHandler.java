package com.myfitnessapp.service.user.handler;

import com.myfitnessapp.service.user.domain.Gender;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(Gender.class)
public class GenderTypeHandler extends BaseTypeHandler<Gender> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Gender parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.getValue());
    }

    @Override
    public Gender getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String genderValue = rs.getString(columnName);
        return convert(genderValue);
    }

    @Override
    public Gender getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String genderValue = rs.getString(columnIndex);
        return convert(genderValue);
    }

    @Override
    public Gender getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String genderValue = cs.getString(columnIndex);
        return convert(genderValue);
    }

    private Gender convert(String genderValue) {
        if (genderValue == null) {
            return null;
        }
        // 根据数据库返回的值进行匹配，比如将"Male"转换为MALE
        for (Gender gender : Gender.values()) {
            if (gender.getValue().equalsIgnoreCase(genderValue)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("未知的Gender值: " + genderValue);
    }
}
