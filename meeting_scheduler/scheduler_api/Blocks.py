class Block:
    def __init__(self, start_time, end_time) -> None:
        self.starts = start_time
        self.ends= end_time
    
    def extend_block_ending(self, new_end_time):
        print("extednded block time of ending")
        self.ends = new_end_time
        print(self)

    def extend_block_beginning(self, new_start_time):
        print("extednded block time of start")
        self.starts = new_start_time

    def __str__(self) -> str:
        return f"Meeting block from: {self.starts} to {self.ends}"