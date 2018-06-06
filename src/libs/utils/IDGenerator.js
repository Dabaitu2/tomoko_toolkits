/**
 *    Created by tomokokawase
 *    On 2018/6/5
 *    阿弥陀佛，没有bug!
 */


/**
 *
 *  用于生成全局唯一的ID，因为最后所有的文件都被打包在一起了，
 *  Generator是一个单例，因此id不会重复
 *
 *
 * */
class IDGenerator {
    constructor(){
        this.id = 0
    }

    next(){
        // 压缩id的大小在int4即0-65535区间内
        return this.id++ & 0xffff
    }
}

export let IDGen = new IDGenerator();

