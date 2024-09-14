from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func
from datetime import datetime

from .database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    pass_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    picture: Mapped[str | None] = mapped_column(nullable=True)
    members: Mapped[list["GroupMember"]] = relationship(
        "GroupMember", back_populates="user"
    )


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    data_url: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(nullable=False)
    thread_id: Mapped[int] = mapped_column(ForeignKey("threads.id"), nullable=False)
    thread: Mapped["Thread"] = relationship("Thread", back_populates="messages")


class Thread(Base):
    __tablename__ = "threads"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    name: Mapped[str | None] = mapped_column(nullable=True)
    picture: Mapped[str | None] = mapped_column(nullable=True)
    members: Mapped[list["GroupMember"]] = relationship(
        "GroupMember", back_populates="thread"
    )
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="thread")


class GroupMember(Base):
    __tablename__ = "group_members"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(ForeignKey("users.username"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(default=func.now())
    left_at: Mapped[datetime | None] = mapped_column(nullable=True)
    thread_id: Mapped[int] = mapped_column(ForeignKey("threads.id"), nullable=False)
    thread: Mapped["Thread"] = relationship("Thread", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="members")
