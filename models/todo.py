import time
from models import Model


class Todo(Model):
    # @classmethod
    # def new(cls, form):
    #     """
    #     创建并保存一个 todo 并且返回它
    #     Todo.new({'title': '吃饭'})
    #     :param form: 一个字典 包含了 todo 的数据
    #     :return: 创建的 todo 实例
    #     """
    #     # 下面一行相当于 t = Todo(form)
    #     t = cls(form)
    #     t.save()
    #     return t

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        valid_names = [
            'title',
            'completed'
        ]
        for key in form:
            # 这里只应该更新想要更新的东西
            if key in valid_names:
                setattr(t, key, form[key])
        # 更新修改时间
        t.ut = int(time.time())
        t.save()
        return t

    @classmethod
    def complete(cls, id, completed=True):
        """
        Todo.complete(1)
        Todo.complete(2, False)
        """
        t = cls.find(id)
        t.completed = completed
        t.save()
        return t

    def __init__(self, form):
        self.id = None
        self.title = form.get('title', '')
        # 下面的是默认的数据
        self.completed = False
        # ct ut 分别是 created_time  updated_time
        # 创建时间 和 更新时间
        self.ct = int(time.time())
        self.ut = self.ct
