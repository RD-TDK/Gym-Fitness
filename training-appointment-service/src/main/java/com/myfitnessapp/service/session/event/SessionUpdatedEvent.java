package com.myfitnessapp.service.session.event;

import com.myfitnessapp.service.session.model.SessionInfo;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class SessionUpdatedEvent extends ApplicationEvent {
    private final SessionInfo sessionInfo;

    public SessionUpdatedEvent(Object source, SessionInfo sessionInfo) {
        super(source);
        this.sessionInfo = sessionInfo;
    }
}
