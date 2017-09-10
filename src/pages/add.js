import React from 'react'
import $ from 'jquery'
import { Button, Modal, Form, Input, Table } from 'antd';
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal visible={visible} title="添加新的面试信息" okText="确认" cancelText="取消" onCancel={onCancel} onOk={onCreate} >
                <Form layout="vertical">
                    <FormItem label="待面试人姓名">
                        {getFieldDecorator('interviewName',{
                            rules: [{ required: true, message: '请添加面试人姓名！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="面试时间">
                        {getFieldDecorator('interviewTime',{
                            rules: [{ required: true, message: '请添加面试时间！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="邮箱">
                        {getFieldDecorator('interviewEmail',{
                            rules: [{ required: true, message: '请添被面试者联系邮箱！' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

export default class CollectionsPage extends React.Component {
    constructor(){
        super()
        this.state = {
            visible: false,
            interviewer:[],
            key:1,
            timeID:""
        };
    }

    componentDidMount(){
        this.getAllInterviewer()
         const myFetchOptions={
            method:"GET"
        }
        fetch('/maxInterviewKey',myFetchOptions)
        .then(response=>response.json())
        .then(json=>{
            this.setState({
                key:parseInt(json[0].key)+1
            })
        })
    }

    componentWillUnmount(){
      this.getAllInterviewer=null
    }

    getAllInterviewer(){
        const that=this
        $.ajax({
          url:'/getAllInterviewer',
          type:"get",
          timeout:5000,
          success:function(data,textStatus){
            if(textStatus=='success'){
              if(that.getAllInterviewer!==null){
                that.setState({
                  interviewer:data
                })
                that.getAllInterviewer()
              }
            }
          },
          error:function(XMLHttpRequest, textStatus, errorThrown){
            if(textStatus=='timeout'){
              that.getAllInterviewer()
            }else{
              that.getAllInterviewer()
            }
          }
        })
        /*const myFetchOptions={
            method:"GET"
        }
        fetch('/getAllInterviewer',myFetchOptions)
        .then(response=>response.json())
        .then(json=>{
            this.setState({
                interviewer:json
            })
        })*/
    }

    showModal(){
        this.setState({ visible: true });
    }
    handleCancel(){
        this.setState({ visible: false });
    }

    randomString(len) {
    　　len = len || 6;
    　　var chars = 'abcdefghijklmnopqrstuvwxyz123456789';
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
    　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }

    handleCreate(){
        const form = this.form;
        const randomString1=this.randomString(6);
        const randomString2=this.randomString(6)
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            const data={
              key:this.state.key,
              interviewName:values.interviewName,
              interviewTime:values.interviewTime,
              interviewEmail:values.interviewEmail,
              interviewURL:'http://118.89.243.99/db_union/#/chat?_k='+randomString1,
              interviewerURL:'http://118.89.243.99/db_union/#/chat?_k='+randomString2,
              isInterviewerOK:'进入面试房间'
            }
            const that=this
            $.ajax({
                url:'/addInterview',
                type:'post',
                data:data,
                dataType:'json',
                success:function(data){
                    if(data.code==1){
                        alert("添加面试信息成功！")
                    }else if(data.code==0){
                        alert("面试信息重复添加，请检查！")
                    }else{
                        alert("添加面试信息失败！")
                    }
                },
                error:function(){
                    alert("NO")
                }
            })
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    saveFormRef(form){
        this.form = form;
    }

    handleRemove(id){

    }

    handleChange(id){

    }
    render() {      
        const data = this.state.interviewer.length?this.state.interviewer:[];
        const columns = [
            {
                title: 'interviewName',
                dataIndex: 'interviewName',
                key: 'interviewName',
                render: text => <a href="#">{text}</a>,
            }, {
                title: 'interviewTime',
                dataIndex: 'interviewTime',
                key: 'interviewTime',
            }, {
                title: 'interviewEmail',
                dataIndex: 'interviewEmail',
                key: 'interviewEmail',
            }, {
                title: 'interviewURL',
                dataIndex: 'interviewURL',
                key: 'interviewURL',
                render:(text,record)=><a href={text}>{record.isInterviewerOK}</a>
            },{
                title: 'interviewerURL',
                dataIndex: 'interviewerURL',
                key: 'interviewerURL',
                render:text=><a>{text}</a>
            }, {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={this.handleRemove.bind(this,record.key)}>Delete</a>
                        <span className="ant-divider" />
                        <a onClick={this.handleChange.bind(this,record.key)}>Change</a>
                    </span>
                ),
            }
        ];

        return (
        <div>
            <Button icon="plus" onClick={this.showModal.bind(this)}>Add</Button>
            <CollectionCreateForm ref={this.saveFormRef.bind(this)} visible={this.state.visible} onCancel={this.handleCancel.bind(this)} onCreate={this.handleCreate.bind(this)} />
            <Table style={{marginTop:20}} columns={columns} dataSource={data} />
        </div>
        );
    }
}