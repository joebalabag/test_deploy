#include<iostream>
#include<cstring>
#include<windows.h>
#include<fstream>
using namespace std;

string toLower(string);
bool createRoute(string);
bool createController(string);

const string APPROOT = "./../";
const string APPROUTE = "./../../routes/";
const string APPCONTROLLER = "./../../controller/";
const string ROUTE_TEMPLATE = "route.template.dat";
const string CONTROLLER_TEMPLATE = "controller.template.dat";

int main(int argc, char* argv[])
{
    if(argc > 1){
        string arg = argv[1];
        arg = toLower(arg);
        if(arg.compare("create") == 0){
            string type = argv[2];
            type = toLower(type);
            if(type.compare("-c") == 0 || type.compare("--controller") == 0){
                string name = argv[3];
                bool status = createController(name);
                if(status) cout << "Controller successfully created" << endl
                                << "File located at: " << APPCONTROLLER << name << ".js";
            }else if(type.compare("-rc") == 0){
                string name = argv[3];
                bool status = createRoute(name);
                status &= createController(name);
                if(status) cout << "Route successfully created" << endl
                                << "File located at: " << APPROUTE << name << ".js";

                if(status) cout << "Controller successfully created" << endl
                                << "File located at: " << APPCONTROLLER << name << ".js";

            }
        }else if(arg.compare("-h") == 0 || arg.compare("--help") == 0){
            cout << "-c [type], --create [type]"
                 << "Create a file for the API" << endl
                 << "-h, --help"
                 << "View this help file" << endl;


        }
    }
    return 0;
}

bool createRoute(string name){
    try{
        ifstream ifs(ROUTE_TEMPLATE.c_str());
        string content((istreambuf_iterator<char>(ifs)),(istreambuf_iterator<char>()));

        ofstream route;
        const string filename = APPROUTE + name + "Route.js";
        route.open(filename.c_str());


        size_t index = 0;
        while (true) {
            index = content.find("{{ route }}", index);
            if (index == std::string::npos) break;

            content.replace(index, 11,toLower(name));
            index += 11;
        }

        route << content;
        route.close();
    }catch(exception e){
        return false;
    }
    return true;
}


bool createController(string name){
    try{
        ifstream ifs(CONTROLLER_TEMPLATE.c_str());
        string content((istreambuf_iterator<char>(ifs)),(istreambuf_iterator<char>()));

        ofstream route;
        const string filename = APPCONTROLLER + name + "Controller.js";
        route.open(filename.c_str());


        size_t index = 0;
        while (true) {
            index = content.find("{{ controller }}", index);
            if (index == std::string::npos) break;

            content.replace(index, 16,toLower(name));
            index += 16;
        }

        route << content;
        route.close();
    }catch(exception e){
        return false;
    }
    return true;
}

string toLower(string str){
    string temp = "";
    for(int i = 0; i < str.size()/sizeof(char); i++){
        temp += tolower(str[i]);
    }
    return temp;
}
