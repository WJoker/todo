from models import Model
from models.user import User
import time


# 微博类
class Weibo(Model):
    def __init__(self, form):
        self.id = None
        self.content = form.get('title', '')
        # 下面的是默认的数据
        self.completed = False
        # ct ut 分别是 created_time  updated_time
        # 创建时间 和 更新时间
        self.ct = int(time.time())
        self.ut = self.ct

    def json(self):
        d = self.__dict__.copy()
        comments = [c.json() for c in self.comments()]
        d['comments'] = comments
        return d

    def comments(self):
        return Comment.find_all(weibo_id=self.id)

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        valid_names = [
            'title',
            'completed'
        ]
        for key in form:
            # 这里只应该更新我们想要更新的东西
            if key in valid_names:
                setattr(t, key, form[key])
        # 更新修改时间
        t.ut = int(time.time())
        t.save()
        return t

    @classmethod
    def complete(cls, id, completed=True):
        """
        用法很方便
        Todo.complete(1)
        Todo.complete(2, False)
        """
        t = cls.find(id)
        t.completed = completed
        t.save()
        return t


# 评论类
class Comment(Model):
    def __init__(self, form):
        self.id = None
        self.content = form.get('content', '')
        # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        self.weibo_id = int(form.get('weibo_id', -1))
